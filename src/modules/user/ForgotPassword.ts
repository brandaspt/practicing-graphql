import { Arg, Mutation, Resolver } from "type-graphql"
import { User } from "../../entity/User"
import { sendEmail } from "../utils/sendEmail"
import { createForgotPasswordURL } from "../utils/createForgotPasswordURL"

@Resolver()
export class ForgotPasswordResolver {
	@Mutation(() => Boolean)
	async forgotPassword(@Arg("email") email: string): Promise<boolean> {
		const user = await User.findOne({ where: { email } })

		if (!user) return true

		await sendEmail(email, await createForgotPasswordURL(user.id))

		return true
	}
}
