import { Arg, Ctx, Mutation, Resolver } from "type-graphql"
import bcrypt from "bcryptjs"
import { User } from "../../entity/User"
import { MyContext } from "../../types/MyContext"
import { createConfirmationURL } from "../utils/createConfirmationURL"
import { sendEmail } from "../utils/sendEmail"

@Resolver()
export class LoginResolver {
	@Mutation(() => User, { nullable: true })
	async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() ctx: MyContext): Promise<User | null> {
		const user = await User.findOne({ where: { email } })

		if (!user) return null

		const valid = await bcrypt.compare(password, user.password)

		if (!valid) return null

		if (!user.confirmed) {
			await sendEmail(email, await createConfirmationURL(user.id))
			return null
		}

		ctx.req.session.userId = user.id

		return user
	}
}
