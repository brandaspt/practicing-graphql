import { IsEmail, Length } from "class-validator"
import { Field, InputType } from "type-graphql"
import { PasswordMixin } from "../../shared/PasswordMixin"
import { isEmailAlreadyUsed } from "./isEmailAlreadyUsed"

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
	@Field()
	@Length(1, 255)
	firstName: string

	@Field()
	@Length(1, 255)
	lastName: string

	@Field()
	@IsEmail()
	@isEmailAlreadyUsed({ message: "email already in use" })
	email: string
}
