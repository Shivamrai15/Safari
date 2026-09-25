import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

const LOGIN_ALERT_TIMEOUT_MS = 5000;

function describeDevice() {
    const userAgent = headers().get("user-agent") || "";

    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const deviceName = device.model
        ? `${device.vendor || ""} ${device.model}`.trim()
        : `${browser.name ?? "a browser"} on ${os.name ?? "an unknown system"}`;

    return `Safari Web (${deviceName})`;
}

async function queueLoginAlert(userId: string, deviceName: string) {
    const baseUrl = process.env.AUTH_SERVER_URL;
    const secret = process.env.JWT_SECRET;
    if (!baseUrl || !secret) return false;

    const token = jwt.sign({ userId }, secret, { expiresIn: 60 });
    const response = await fetch(`${baseUrl}/api/v2/auth/login-alert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ device: deviceName }),
        signal: AbortSignal.timeout(LOGIN_ALERT_TIMEOUT_MS),
        cache: "no-store",
    });

    return response.ok;
}

export async function generateLoginNotification(userId: string){
    try {

        const deviceName = describeDevice();

        const queued = await queueLoginAlert(userId, deviceName).catch((error) => {
            console.error("LOGIN ALERT REQUEST ERROR:", error);
            return false;
        });
        if (queued) return;

        await db.notification.create({
            data: {
                userId: userId,
                type: "ALERT",
                title: "New sign-in to your account",
                message: `Your Safari account was just signed in on ${deviceName}. If this wasn't you, secure your account right away.`,
                read: false,
                webIcon : "triangle-alert",
                appIcon : "alert-outline",
            }
        });

    } catch (error) {
        console.error("LOGIN NOTIFICATION ERROR:", error);
        return null
    }
}
