import { NextRequest } from "next/server";
import { SendMessageValidator } from "~/lib/validators/SendMessageValidator";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export const POST = async (req: NextRequest) => {
  const body = req.json();

  const session = await getServerAuthSession();
  const userId = session?.user.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) {
    return new Response("Not Found", { status: 404 });
  }

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  
};
