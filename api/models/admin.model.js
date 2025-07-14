import mongoose from "mongoose"
import bycrypt from "bcryptjs"


const adminSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "admin" },
      },
      { timestamps: true }
    )

   // hash passowrd before saving admin
    adminSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next()
     const salt = await bycrypt.genSalt(10)
     this.password = await bycrypt.hash(this.password, salt)
        next()
    })

    const Admin = mongoose.model("Admin", adminSchema)
    export default Admin
