process.env.SEEDING = 'true';

import { auth } from "@/lib/auth";
import { membersData } from "./membersData";
import { prisma } from "@/lib/prisma";

async function seedAdmin() {
    const result = await auth.api.signUpEmail({
        body: {
            email: 'admin@test.com',
            password: 'Pa$$w0rd',
            name: 'Admin'
        }
    });

    await prisma.user.update({
        where: {id: result.user.id},
        data: {emailVerified: true, role: 'admin', profileComplete: true}
    })
}

async function seedUsers() {
    for (const member of membersData) {
        const result = await auth.api.signUpEmail({
            body: {
                email: member.email,
                password: 'Pa$$w0rd',
                name: member.name,
                image: member.image
            }
        });

        const userId = result.user.id;

        await prisma.user.update({
            where: {id: userId},
            data: {
                emailVerified: true,
                profileComplete: true,
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
                            create: [
                                {url: member.image, status: 'approved'}
                            ]
                        }
                    }
                }
            }
        })
    }
}

async function main() {
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
        console.log("Database already contains users. Skipping");
        return;
    }
    await seedUsers();
    await seedAdmin();
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })