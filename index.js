import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

app.get("/", (req, res) => {
    res.send("BarkadaCraft Backend is running!");
});

app.post("/donation", async (req, res) => {

    try {

        const channel = await client.channels.fetch("1526554979836624936");

        const data = req.body;

        const embed = new EmbedBuilder()
            .setColor(0x00ff66)
            .setTitle("💰 New Donation Submitted")
            .addFields(
                { name: "IGN", value: data.ign || "Unknown", inline: true },
                { name: "Discord", value: data.discord || "N/A", inline: true },
                { name: "Type", value: data.type || "N/A", inline: true },
                { name: "Amount", value: `₱${data.amount || 0}`, inline: true },
                { name: "Duration", value: data.duration || "N/A", inline: true },
                { name: "Message", value: data.message || "No message" }
            )
            .setImage(data.receiptUrl)
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
