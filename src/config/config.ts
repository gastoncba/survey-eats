import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
    uri: process.env.MONGO_URL || ''
}

