-- CreateIndex
CREATE INDEX "Like_targetUserId_idx" ON "Like"("targetUserId");

-- CreateIndex
CREATE INDEX "Member_gender_dateOfBirth_idx" ON "Member"("gender", "dateOfBirth");

-- CreateIndex
CREATE INDEX "Member_updated_idx" ON "Member"("updated");

-- CreateIndex
CREATE INDEX "Member_created_idx" ON "Member"("created");

-- CreateIndex
CREATE INDEX "Message_senderId_created_idx" ON "Message"("senderId", "created");

-- CreateIndex
CREATE INDEX "Message_recipientId_created_idx" ON "Message"("recipientId", "created");

-- CreateIndex
CREATE INDEX "Message_recipientId_dateRead_idx" ON "Message"("recipientId", "dateRead");

-- CreateIndex
CREATE INDEX "Photo_memberId_idx" ON "Photo"("memberId");
