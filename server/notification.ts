"use server";

import { db } from "@/lib/db";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export async function generateLoginNotification(userId: string){
    try {
        
        const headerList = headers();
        const userAgent = headerList.get("user-agent") || "";

        const parser = new UAParser(userAgent);
        const browser = parser.getBrowser();
        const os = parser.getOS();
        const device = parser.getDevice();

        const deviceName = device.model 
        ? `${device.vendor || ""} ${device.model}`.trim() 
        : `${browser.name} on ${os.name}`;



        await db.notification.create({
            data: {
                userId: userId,
                type: "ALERT",
                title: "Security Alert: New Login",
                message: `Your account was accessed from a new device: ${deviceName}.`,
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