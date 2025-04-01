import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { Post } from "@/types/Post";
import { Colours } from "@/utils/Colours";
import { PostModel } from "@/db/models/Post.model";

export async function handleApprovalProcess(
  interaction: ChatInputCommandInteraction,
  staffChannel: TextChannel,
  post: Post
): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(Colours.INFO)
    .setTitle(
      `${
        post.subcommand.charAt(0).toUpperCase() + post.subcommand.slice(1)
      } | ${post.information.title}`
    )
    .setDescription(
      `${post.information.formattedDescription}\n\n**Post ID:** \`${post.id}\``
    )
    .setFooter({
      text: `Submitted by ${interaction.user.tag} (${interaction.user.id})`,
    })
    .setTimestamp();

  const staffPost = await staffChannel.send({
    content: `<@&${process.env.STAFF_ID}> A new post requires approval.`,
    embeds: [embed],
  });

  // Convert the Post object to a PostModel instance
  const postModel = new PostModel(
    post.id,
    post.subcommand,
    post.information,
    post.status,
    staffPost.id
  );

  // Save the staffPost ID to the database
  await postModel.save();

  await interaction.followUp({
    content: `Your ${post.subcommand} has been submitted for approval. Staff will review it shortly. Post ID: \`${post.id}\`.`,
    ephemeral: true,
  });
}
