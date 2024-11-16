-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_connectedToId_fkey" FOREIGN KEY ("connectedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
