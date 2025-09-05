import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting test to write and read from the new analytics tables...');

  // 1. Create a new search log entry
  console.log('\nAttempting to create a test search log...');
  const newLog = await prisma.searchLog.create({
    data: {
      visitorId: 'test-visitor-123',
      query: 'How to test my new tables?',
      resultsCount: 1,
    },
  });
  console.log('✅ Successfully created log:');
  console.log(newLog);

  // 2. Read the entry back to verify
  console.log('\nAttempting to read the log back...');
  const foundLog = await prisma.searchLog.findUnique({
    where: {
      id: newLog.id,
    },
  });
  console.log('✅ Successfully found the created log:');
  console.log(foundLog);

  // 3. Clean up the test data
  console.log('\nCleaning up (deleting) the test data...');
  await prisma.searchLog.delete({
    where: {
      id: newLog.id,
    },
  });
  console.log('✅ Test data cleaned up.');
}

main()
  .catch((e) => {
    console.error('❌ Test failed with an error:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\nTest finished and disconnected from the database.');
  });
