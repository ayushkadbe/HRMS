import db from "./config/Database.js";
import DataPegawai from "./models/DataPegawaiModel.js";
import argon2 from "argon2";

const resetPassword = async () => {
    try {
        await db.authenticate();
        console.log("Database connected.");

        const hashPassword = await argon2.hash("admin");
        
        await DataPegawai.update(
            { password: hashPassword },
            { where: { username: "aldi" } }
        );

        console.log("Password for user 'aldi' has been reset to 'admin'.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating password:", error);
        process.exit(1);
    }
};

resetPassword();
