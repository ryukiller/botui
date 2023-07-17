
import mongoose from 'mongoose'
const { Schema, model } = mongoose;
import { NextResponse } from "next/server";


mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

// Define song schema

const rewardsSchema = new Schema(
    {
        usdc_amount: { type: String, required: true },
        weth_amount: { type: String, required: true },
        weth_in_usdc: { type: String, required: true },
        total_fees: { type: String, required: true },
        timestamp: { type: String, required: true },
    },
    { collection: "rewards" }
);

const Rewards = mongoose.models.Rewards || model("Rewards", rewardsSchema);

export async function POST(req) {
    // post when a position is closed with rewards amount_usdc, amount_weth, weth_in_usdc, timestamp

    const body = await req.json()



    try {
        const { usdc_amount, weth_amount, weth_in_usdc, total_fees } = body;

        const timestamp = new Date();

        const reward = new Rewards({
            usdc_amount: usdc_amount,
            weth_amount: weth_amount,
            weth_in_usdc: weth_in_usdc,
            total_fees: total_fees,
            timestamp: timestamp,
        });

        // Save the song to the database
        await reward.save();

        return NextResponse.json({ message: "Rewards saved successfully " })
    } catch (error) {
        console.error("Error saving Rewards: ", error);
        return NextResponse.json({ message: "Error saving Rewards " })
    }

}

export async function GET(req) {
    // get the rewards amount to have an history of rewards
    try {
        const rewards = await Rewards.find({})
            .select("-__v")
            .exec();

        return NextResponse.json({ rewards })
    } catch (error) {
        console.error("Error saving Rewards: ", error);
        return NextResponse.json({ message: "Error getting Rewards " })
    }


}