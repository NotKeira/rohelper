export interface PostInformation {
  title: string;
  description: string;
  requirements?: string;
  salary?: string;
  links?: string;
  formattedDescription: string;
  userId: string;
}

export interface Post {
  id: string;
  subcommand: string;
  information: PostInformation;
  status: "pending" | "approved" | "rejected";
  staffPostId?: string;
}
