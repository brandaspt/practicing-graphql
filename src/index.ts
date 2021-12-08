import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import Express from "express"
import { createConnection } from "typeorm"
import session from "express-session"
import connectRedis from "connect-redis"
import { redis } from "./redis"
import { RedisClient } from "redis"
//import cors from "cors"
import { MyContext } from "./types/MyContext"
import { corsOptions } from "./settings/cors"
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"
import { createSchema } from "./utils/createSchema"
import { graphqlUploadExpress } from "graphql-upload"

const PORT = 4000

const main = async () => {
	await createConnection()

	const apolloServer = new ApolloServer({
		schema: await createSchema(),
		context: ({ req, res }: MyContext) => ({ req, res }),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
	})

	const app = Express()

	//app.use(cors(corsOptions))

	const RedisStore = connectRedis(session)

	const sessionOption: session.SessionOptions = {
		store: new RedisStore({
			client: redis as unknown as RedisClient,
		}),
		name: "qid",
		secret: "hkhdk2378jksd",
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			//sameSite: "none",
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
		},
	}

	app.use(session(sessionOption))
	app.use(graphqlUploadExpress())

	await apolloServer.start()
	apolloServer.applyMiddleware({ app, cors: corsOptions })

	app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/graphql`))
}
main()
