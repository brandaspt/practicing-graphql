import nodemailer from "nodemailer"

export const sendEmail = async (email: string, url: string) => {
	const account = await nodemailer.createTestAccount()

	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: account.user,
			pass: account.pass,
		},
	})

	const info = await transporter.sendMail({
		from: '"Fred Foo 👻" <foo@example.com>', // sender address
		to: email, // list of receivers
		subject: "Hello ✔", // Subject line
		text: "Hello world?", // plain text body
		html: `<a href="${url}">${url}</a>`, // html body
	})

	console.log(`Message sent: ${info.messageId}`)
	console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}
