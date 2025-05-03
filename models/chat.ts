import { Schema, models, model } from "mongoose";

const ChatSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username harus diisi"],
      trim: true,
    },
    sender: {
      type: String,
      enum: {
        values: ["user", "ai"],
        message: "Sender harus 'user' atau 'ai'",
      },
      required: [true, "Sender harus diisi"],
    },
    message: {
      type: String,
      required: [true, "Pesan tidak boleh kosong"],
      trim: true,
      minlength: [1, "Pesan terlalu pendek"],
      maxlength: [5000, "Pesan terlalu panjang (maksimal 5000 karakter)"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Tambahkan index untuk performa query
ChatSchema.index({ username: 1, createdAt: -1 });

export default models.Chat || model("Chat", ChatSchema);
