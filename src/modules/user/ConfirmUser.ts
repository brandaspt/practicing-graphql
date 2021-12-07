import { Arg, Mutation, Resolver } from "type-graphql"
import { redis } from "../../redis"
import { User } from "../../entity/User"
import { confirmUserPrefix } from "../constants/redisPrefixes"

@Resolver()
export class ConfirmUserResolver {
	@Mutation(() => Boolean)
	async confirmUser(@Arg("token") token: string): Promise<boolean> {
		const userId = (await redis.get(confirmUserPrefix + token)) as number | null

		if (!userId) return false

		await User.update({ id: userId }, { confirmed: true })
		await redis.del(token)

		return true
	}
}
