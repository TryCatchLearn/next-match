import { PrismaClient } from '@prisma/client';
import { membersData } from './membersData';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedMembers() {
    return membersData.map(async member => prisma.user.create({
        data: {
            email: member.email,
            emailVerified: new Date(),
            name: member.name,
            passwordHash: await hash('password', 10),
            image: member.image,
            member: {
                create: {
                    dateOfBirth: new Date(member.dateOfBirth),
                    gender: member.gender,
                    name: member.name,
                    created: new Date(member.created),
                    updated: new Date(member.lastActive),
                    description: member.description,
                    city: member.city,
                    country: member.country,
                    image: member.image,
                    photos: {
                        create: {
                            url: member.image
                        }
                    }
                }
            }
        }
    }))
}

async function main() {
    await seedMembers();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})