import bcrypt from "bcrypt";
import { config } from "../config/config";

const SALT_ROUNDS = config.SALT_ROUNDS;

//  Hashes a plain-text password using bcrypt.
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

// Compares a plain-text password with a hash.
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
