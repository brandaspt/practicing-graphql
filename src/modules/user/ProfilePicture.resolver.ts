import { Arg, Mutation, Resolver } from "type-graphql"
import { FileUpload, GraphQLUpload } from "graphql-upload"
import { createWriteStream } from "fs"

@Resolver()
export class ProfilePictureResolver {
	@Mutation(() => Boolean)
	async addProfilePicture(@Arg("picture", () => GraphQLUpload) { createReadStream, filename }: FileUpload): Promise<boolean> {
		console.log("here")
		return new Promise(async (res, rej) =>
			createReadStream()
				.pipe(createWriteStream(__dirname + `/../../../images/${filename}`))
				.on("finish", () => res(true))
				.on("error", err => {
					console.log(err)
					rej(false)
				})
		)
	}
}
