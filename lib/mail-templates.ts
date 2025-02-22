export const emailVerificationTemplate = (verificationUrl : string) => (
    `
    <!DOCTYPE html>
    <html
    lang="en"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
    >
    <head>
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link
        href="https://fonts.googleapis.com/css2?family=Droid+Serif:wght@100;200;300;400;500;600;700;800;900"
        rel="stylesheet"
        type="text/css"
        />
        <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit;
        }

        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }

        .image_block img + div {
            display: none;
        }

        sup,
        sub {
            font-size: 75%;
            line-height: 0;
        }

        @media (max-width: 620px) {
            .desktop_hide table.icons-inner {
            display: inline-block !important;
            }

            .icons-inner {
            text-align: center;
            }

            .icons-inner td {
            margin: 0 auto;
            }

            .mobile_hide {
            display: none;
            }

            .row-content {
            width: 100% !important;
            }

            .stack .column {
            width: 100%;
            display: block;
            }

            .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
            display: table !important;
            max-height: none !important;
            }
        }
        </style>
        <!--[if mso
        ]><style>
            sup,
            sub {
            font-size: 100% !important;
            }
            sup {
            mso-text-raise: 10%;
            }
            sub {
            mso-text-raise: -10%;
            }
        </style>
        <![endif]-->
    </head>
    <body
        class="body"
        style="
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
        "
    >
        <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="nl-container"
        role="presentation"
        style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            background-color: #ffffff;
        "
        width="100%"
        >
        <tbody>
            <tr>
            <td>
                <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-1"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
                >
                <tbody>
                    <tr>
                    <td>
                        <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-radius: 0;
                            color: #000000;
                            width: 600px;
                            margin: 0 auto;
                        "
                        width="600"
                        >
                        <tbody>
                            <tr>
                            <td
                                class="column column-1"
                                style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                "
                                width="100%"
                            >
                                <div
                                class="spacer_block block-1"
                                style="
                                    height: 40px;
                                    line-height: 40px;
                                    font-size: 1px;
                                "
                                >
                                 
                                </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-2"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
                >
                <tbody>
                    <tr>
                    <td>
                        <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-radius: 0;
                            color: #000000;
                            background-color: #242424;
                            padding-bottom: 30px;
                            padding-top: 30px;
                            width: 600px;
                            margin: 0 auto;
                        "
                        width="600"
                        >
                        <tbody>
                            <tr>
                            <td
                                class="column column-1"
                                style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                "
                                width="100%"
                            >
                                <table
                                border="0"
                                cellpadding="20"
                                cellspacing="0"
                                class="heading_block block-1"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td class="pad">
                                    <h1
                                        style="
                                        margin: 0;
                                        color: #ffffff;
                                        direction: ltr;
                                        font-family: 'Droid Serif', Georgia, Times,
                                            'Times New Roman', serif;
                                        font-size: 16px;
                                        font-weight: 700;
                                        letter-spacing: normal;
                                        line-height: 120%;
                                        text-align: left;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                        mso-line-height-alt: 19.2px;
                                        "
                                    >
                                        Welcome to Safari!
                                    </h1>
                                    </td>
                                </tr>
                                </table>
                                <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="paragraph_block block-2"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td
                                    class="pad"
                                    style="
                                        padding-bottom: 10px;
                                        padding-left: 20px;
                                        padding-right: 20px;
                                        padding-top: 10px;
                                    "
                                    >
                                    <div
                                        style="
                                        color: #c7c7c7;
                                        direction: ltr;
                                        font-family: 'Droid Serif', Georgia, Times,
                                            'Times New Roman', serif;
                                        font-size: 13px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 15.6px;
                                        "
                                    >
                                        <p style="margin: 0">
                                        Thank you for signing up! Please verify
                                        your email by clicking the link below:
                                        </p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="button_block block-3"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td
                                    class="pad"
                                    style="
                                        padding-bottom: 15px;
                                        padding-left: 20px;
                                        padding-right: 20px;
                                        padding-top: 15px;
                                        text-align: center;
                                    "
                                    >
                                    <div align="center" class="alignment">
                                        <a
                                        href="${verificationUrl}"
                                        style="
                                            color: #0f0f0f;
                                            text-decoration: none;
                                        "
                                        target="_blank"
                                        >><!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="http://localhost:3000"  style="height:34px;width:202px;v-text-anchor:middle;" arcsize="27%" fillcolor="#ededed">
    <v:stroke dashstyle="Solid" weight="0px" color="#ededed"/>
    <w:anchorlock/>
    <v:textbox inset="0px,0px,0px,0px">
    <center dir="false" style="color:#0f0f0f;font-family:sans-serif;font-size:13px">
    <!
                                        [endif]--><span
                                            class="button"
                                            style="
                                            background-color: #ededed;
                                            border-bottom: 0px solid transparent;
                                            border-left: 0px solid transparent;
                                            border-radius: 9px;
                                            border-right: 0px solid transparent;
                                            border-top: 0px solid transparent;
                                            color: #0f0f0f;
                                            display: inline-block;
                                            font-family: Arial, Helvetica,
                                                sans-serif;
                                            font-size: 13px;
                                            font-weight: 400;
                                            mso-border-alt: none;
                                            padding-bottom: 4px;
                                            padding-top: 4px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            text-align: center;
                                            width: auto;
                                            word-break: keep-all;
                                            letter-spacing: normal;
                                            "
                                            ><span
                                            style="
                                                word-break: break-word;
                                                line-height: 26px;
                                            "
                                            ><strong
                                                >Confirm my email address</strong
                                            ></span
                                            ></span
                                        >><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></a</a
                                        >
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="paragraph_block block-4"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td
                                    class="pad"
                                    style="
                                        padding-bottom: 10px;
                                        padding-left: 20px;
                                        padding-right: 20px;
                                        padding-top: 20px;
                                    "
                                    >
                                    <div
                                        style="
                                        color: #c7c7c7;
                                        direction: ltr;
                                        font-family: 'Droid Serif', Georgia, Times,
                                            'Times New Roman', serif;
                                        font-size: 13px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 15.6px;
                                        "
                                    >
                                        <p style="margin: 0">
                                        This link will expire in
                                        <strong>10 minutes</strong>. If it
                                        expires, you can request a new one. If you
                                        didn’t sign up, please ignore this email.
                                        </p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-3"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
                >
                <tbody>
                    <tr>
                    <td>
                        <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-radius: 0;
                            color: #000000;
                            width: 600px;
                            margin: 0 auto;
                        "
                        width="600"
                        >
                        <tbody>
                            <tr>
                            <td
                                class="column column-1"
                                style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                "
                                width="100%"
                            >
                                <div
                                class="spacer_block block-1"
                                style="
                                    height: 40px;
                                    line-height: 40px;
                                    font-size: 1px;
                                "
                                >
                                 
                                </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>
    </body>
    </html>
    `
)


export const forgetPasswordTemplate = (verificationUrl : string) => (
    `
    <!DOCTYPE html>
    <html
    lang="en"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
    >
    <head>
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link
        href="https://fonts.googleapis.com/css2?family=Droid+Serif:wght@100;200;300;400;500;600;700;800;900"
        rel="stylesheet"
        type="text/css"
        />
        <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit;
        }

        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }

        .image_block img + div {
            display: none;
        }

        sup,
        sub {
            font-size: 75%;
            line-height: 0;
        }

        @media (max-width: 620px) {
            .desktop_hide table.icons-inner {
            display: inline-block !important;
            }

            .icons-inner {
            text-align: center;
            }

            .icons-inner td {
            margin: 0 auto;
            }

            .mobile_hide {
            display: none;
            }

            .row-content {
            width: 100% !important;
            }

            .stack .column {
            width: 100%;
            display: block;
            }

            .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
            display: table !important;
            max-height: none !important;
            }
        }
        </style>
        <!--[if mso
        ]><style>
            sup,
            sub {
            font-size: 100% !important;
            }
            sup {
            mso-text-raise: 10%;
            }
            sub {
            mso-text-raise: -10%;
            }
        </style>
        <![endif]-->
    </head>
    <body
        class="body"
        style="
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
        "
    >
        <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="nl-container"
        role="presentation"
        style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            background-color: #ffffff;
        "
        width="100%"
        >
        <tbody>
            <tr>
            <td>
                <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-1"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
                >
                <tbody>
                    <tr>
                    <td>
                        <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-radius: 0;
                            color: #000000;
                            width: 600px;
                            margin: 0 auto;
                        "
                        width="600"
                        >
                        <tbody>
                            <tr>
                            <td
                                class="column column-1"
                                style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                "
                                width="100%"
                            >
                                <div
                                class="spacer_block block-1"
                                style="
                                    height: 40px;
                                    line-height: 40px;
                                    font-size: 1px;
                                "
                                >
                                 
                                </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-2"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
                >
                <tbody>
                    <tr>
                    <td>
                        <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-radius: 0;
                            color: #000000;
                            background-color: #242424;
                            padding-bottom: 30px;
                            padding-top: 30px;
                            width: 600px;
                            margin: 0 auto;
                        "
                        width="600"
                        >
                        <tbody>
                            <tr>
                            <td
                                class="column column-1"
                                style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                "
                                width="100%"
                            >
                                <table
                                border="0"
                                cellpadding="20"
                                cellspacing="0"
                                class="heading_block block-1"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td class="pad">
                                    <h1
                                        style="
                                        margin: 0;
                                        color: #ffffff;
                                        direction: ltr;
                                        font-family: 'Droid Serif', Georgia, Times,
                                            'Times New Roman', serif;
                                        font-size: 16px;
                                        font-weight: 700;
                                        letter-spacing: normal;
                                        line-height: 120%;
                                        text-align: left;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                        mso-line-height-alt: 19.2px;
                                        "
                                    >
                                        Reset Your Password!
                                    </h1>
                                    </td>
                                </tr>
                                </table>
                                <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="paragraph_block block-2"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td
                                    class="pad"
                                    style="
                                        padding-bottom: 10px;
                                        padding-left: 20px;
                                        padding-right: 20px;
                                        padding-top: 10px;
                                    "
                                    >
                                    <div
                                        style="
                                        color: #c7c7c7;
                                        direction: ltr;
                                        font-family: 'Droid Serif', Georgia, Times,
                                            'Times New Roman', serif;
                                        font-size: 13px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 15.6px;
                                        "
                                    >
                                        <p style="margin: 0">
                                        We received a request to reset your password. Please click the link below to set a new password:
                                        </p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="button_block block-3"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td
                                    class="pad"
                                    style="
                                        padding-bottom: 15px;
                                        padding-left: 20px;
                                        padding-right: 20px;
                                        padding-top: 15px;
                                        text-align: center;
                                    "
                                    >
                                    <div align="center" class="alignment">
                                        <a
                                        href="${verificationUrl}"
                                        style="
                                            color: #0f0f0f;
                                            text-decoration: none;
                                        "
                                        target="_blank"
                                        >><!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"  href="http://localhost:3000"  style="height:34px;width:202px;v-text-anchor:middle;" arcsize="27%" fillcolor="#ededed">
    <v:stroke dashstyle="Solid" weight="0px" color="#ededed"/>
    <w:anchorlock/>
    <v:textbox inset="0px,0px,0px,0px">
    <center dir="false" style="color:#0f0f0f;font-family:sans-serif;font-size:13px">
    <!
                                        [endif]--><span
                                            class="button"
                                            style="
                                            background-color: #ededed;
                                            border-bottom: 0px solid transparent;
                                            border-left: 0px solid transparent;
                                            border-radius: 9px;
                                            border-right: 0px solid transparent;
                                            border-top: 0px solid transparent;
                                            color: #0f0f0f;
                                            display: inline-block;
                                            font-family: Arial, Helvetica,
                                                sans-serif;
                                            font-size: 13px;
                                            font-weight: 400;
                                            mso-border-alt: none;
                                            padding-bottom: 4px;
                                            padding-top: 4px;
                                            padding-left: 20px;
                                            padding-right: 20px;
                                            text-align: center;
                                            width: auto;
                                            word-break: keep-all;
                                            letter-spacing: normal;
                                            "
                                            ><span
                                            style="
                                                word-break: break-word;
                                                line-height: 26px;
                                            "
                                            ><strong
                                                >Reset Password Link</strong
                                            ></span
                                            ></span
                                        >><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></a</a
                                        >
                                    </div>
                                    </td>
                                </tr>
                                </table>
                                <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="paragraph_block block-4"
                                role="presentation"
                                style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                "
                                width="100%"
                                >
                                <tr>
                                    <td
                                    class="pad"
                                    style="
                                        padding-bottom: 10px;
                                        padding-left: 20px;
                                        padding-right: 20px;
                                        padding-top: 20px;
                                    "
                                    >
                                    <div
                                        style="
                                        color: #c7c7c7;
                                        direction: ltr;
                                        font-family: 'Droid Serif', Georgia, Times,
                                            'Times New Roman', serif;
                                        font-size: 13px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 120%;
                                        text-align: left;
                                        mso-line-height-alt: 15.6px;
                                        "
                                    >
                                        <p style="margin: 0">
                                        This link will expire in
                                        <strong>10 minutes</strong>. If it
                                        expires, you can request a new one. If you
                                        didn’t sign up, please ignore this email.
                                        </p>
                                    </div>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-3"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
                >
                <tbody>
                    <tr>
                    <td>
                        <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-radius: 0;
                            color: #000000;
                            width: 600px;
                            margin: 0 auto;
                        "
                        width="600"
                        >
                        <tbody>
                            <tr>
                            <td
                                class="column column-1"
                                style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                                "
                                width="100%"
                            >
                                <div
                                class="spacer_block block-1"
                                style="
                                    height: 40px;
                                    line-height: 40px;
                                    font-size: 1px;
                                "
                                >
                                 
                                </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>
    </body>
    </html>
    `
)