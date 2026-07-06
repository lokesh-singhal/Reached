import mongoose from "mongoose";


const schema = new mongoose.Schema(
{},
{ collection: "user", strict: false }
);


export default mongoose.models.AuthUser || mongoose.model("AuthUser", schema);