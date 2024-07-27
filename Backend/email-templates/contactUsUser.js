
function contactUsUser(name) {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Contact Us - IEEE AUSB</title>
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
				width: 25%;
				/* height: 100px; */
				margin: 10px;
				object-fit: contain;
			}
			h2 {
				color: #333;
				margin-top: 0;
			}
			p {
				margin-bottom: 20px;
			}

			.best-regards-div{
				margin-bottom: 0;
			}

			.last-div{
				margin-top: 8px;
			}

		</style>
	</head>
	<body>
		<div class="container">
			<div class="logos">
				<img src="https://res.cloudinary.com/dub5rms8i/image/upload/v1721848407/au_logo_jcaotv.png" alt="Ahmedabad University Logo">
				<img src="https://res.cloudinary.com/dub5rms8i/image/upload/v1721848407/ieee_logo_urpxug.png" alt="IEEE Logo">
			</div>
			<h2>Thank you for contacting us!</h2>
			<p>Dear ${name},</p>
			<p>We appreciate your interest in IEEE AUSB and thank you for taking the time to contact us. We will be happy to get in touch with you soon.</p>
			<p>Your message has been received and we will respond to you shortly.</p>
			<p class="best-regards-div">Best regards,</p>
			<p class="last-div">IEEE AUSB Team</p>
		</div>
	</body>
	</html>
	`;
}

module.exports = contactUsUser;