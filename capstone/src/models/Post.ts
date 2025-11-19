import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorEmail: string;
  tags: string[];
  featuredImage?: string;
  publishedAt: Date;
  updatedAt: Date;
  status: 'published' | 'draft';
  views: number;
  likes: number;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorEmail: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PostSchema.index({ slug: 1 });
PostSchema.index({ authorId: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ tags: 1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;

