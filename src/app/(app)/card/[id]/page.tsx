import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CardEditorClient } from "@/components/features/canvas/CardEditorClient";

interface CardPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CardPageProps) {
  const { id } = await params;
  const template = await prisma.template.findUnique({ where: { id } });
  return { title: template?.title ?? "Card Editor" };
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params;
  const template = await prisma.template.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!template) notFound();

  return <CardEditorClient template={template as any} />;
}
