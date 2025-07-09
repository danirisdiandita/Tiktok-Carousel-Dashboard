import { prisma } from "@/lib/prisma";
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const bucketName = process.env.MINIO_BUCKET_NAME || 'images';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const carouselId = formData.get('carouselId') as string;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}.${fileExt}`;
    
    // Upload to MinIO
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await minioClient.putObject(bucketName, fileName, buffer, buffer.length, {
      'Content-Type': file.type,
    });
    
    // Generate public URL
    const fileUrl = `${process.env.MINIO_PUBLIC_URL || `http://localhost:9000`}/${bucketName}/${fileName}`;
    
    // Save to database
    const image = await prisma.carouselImage.create({
      data: {
        url: fileUrl,
        alt: file.name,
        carousel_id: parseInt(carouselId),
      },
    });
    
    return new Response(JSON.stringify(image));
  } catch (error) {
    console.error('Error uploading to MinIO:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), { status: 500 });
  }
}