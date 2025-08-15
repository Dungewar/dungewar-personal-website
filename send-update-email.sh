#!/usr/bin/env bash
TO=$1
FROM="updates@dungewar.com"
SUBJECT="Website update!"
CHANGES=$2
BOUNDARY="boundary-$(date +%s)-$$"

cat <<EOF | msmtp "$TO"
From: Dungewar Website <$FROM>
To: <$TO>
Subject: $SUBJECT
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="$BOUNDARY"

--$BOUNDARY
Content-Type: text/plain; charset=utf-8

Website update!
New changes include: $CHANGES
Visit: https://dungewar.com

--$BOUNDARY
Content-Type: text/html; charset=utf-8

<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f7f7f5; color:#222;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;">
    <tr><td align="center" style="padding:24px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#fff; border-radius:16px; box-shadow:0 2px 8px rgba(0,0,0,.06); overflow:hidden;">
        <tr><td style="background:#ffd95a; padding:24px 28px; text-align:center;">
          <div style="font:700 20px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#2b1f00;">Dungewar Updates</div>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 8px 0; font:700 24px/1.25 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#111;">The website has been updated 🎉</h1>
          <p style="margin:0; font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#444;">
            New changes include <strong style="color:#2b1f00;">$CHANGES</strong>.
          </p>
        </td></tr>
        <tr><td style="padding:16px 28px;">
          <a href="https://dungewar.com" target="_blank"
             style="display:inline-block; text-decoration:none; font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#2b1f00; background:#ffd95a; padding:12px 18px; border-radius:999px; border:1px solid #ffc82c;">
             View site
          </a>
        </td></tr>
        <tr><td style="padding:28px; border-top:1px solid #eee;">
          <p style="margin:0; font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',Arial,sans-serif; color:#8a8a8a;">
            Sent by Dungewar the Cheese Lord • <a href="https://dungewar.com" style="color:#7a5c00; text-decoration:none;">dungewar.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>

--$BOUNDARY--
EOF
