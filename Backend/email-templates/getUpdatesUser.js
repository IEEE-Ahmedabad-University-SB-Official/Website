// emailTemplate.js

function getUpdatesUser(name) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Get Updates - IEEE AUSB</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 90%;
                margin: 40px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .logos {
                text-align: center;
                margin-bottom: 20px;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
            }
            .logos img {
				height: 100px;  /* Set a fixed height */
				object-fit: contain;  /* Maintain aspect ratio */
				margin: 10px;
			}

			.logos .ieee-logo, .logos .au-logo {
				height: 70px;  /* Same height for both logos */
				width: auto;    /* Let the width adjust automatically */
			}
            h2 {
                color: #333;
                margin-top: 0;
            }
            p {
                margin-bottom: 20px;
            }

            .best-regards-div {
                margin-bottom: 0;
            }

            .last-div {
                margin-top: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logos">
				<img class="au-logo" src="https://res.cloudinary.com/dub5rms8i/image/upload/v1721848407/au_logo_jcaotv.png" alt="Ahmedabad University Logo">
				<img class="ieee-logo" src="https://res.cloudinary.com/dub5rms8i/image/upload/v1721848407/ieee_logo_urpxug.png" alt="IEEE Logo">
			</div>
            <h2>Welcome to IEEE AUSB!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for showing interest in staying updated about our organization. We're excited to have you on board!</p>
            <p>You will now receive updates about our events, news, and other activities. Stay tuned!</p>
            <p class="best-regards-div">Best regards,</p>
            <p class="last-div">IEEE AUSB Team</p>
        </div>
    </body>
    </html>
    `;
}

module.exports = getUpdatesUser;
