import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://phucnh622:admin123@ac-k4ljiek-shard-00-00.8ibkxid.mongodb.net:27017,ac-k4ljiek-shard-00-01.8ibkxid.mongodb.net:27017,ac-k4ljiek-shard-00-02.8ibkxid.mongodb.net:27017/?ssl=true&replicaSet=atlas-zjw0mj-shard-0&authSource=admin&appName=Cluster0';

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    if (!mongoose.connection.db) {
      console.error('Không thể kết nối database');
      process.exit(1);
    }
    
    const result = await mongoose.connection.db.collection('quizresults').deleteMany({
      category: { $in: ['borrowed_mind', 'echo_prisoner'] }
    });
    
    console.log(`Đã xóa ${result.deletedCount} kết quả có category không hợp lệ`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

cleanup();
