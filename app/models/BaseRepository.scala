package models

import javax.inject.Inject

import org.slf4j.LoggerFactory
import play.api.db.DBApi
import anorm._

import scala.concurrent.Future

class BaseRepository @Inject()(dbApi: DBApi) (implicit ec: DatabaseExecutionContext) {
  private val logger = LoggerFactory.getLogger(this.getClass)
  val db = dbApi.database("default")

  def createDatabase(sql: String) = Future[Boolean] {
    db.withConnection(autocommit = false) { implicit connection =>
       val result = SQL(sql).execute()
      logger.info(f"createDatabase result: $result")
      result
    }
  }(ec)

  def dropDatabase(database: String) = Future[Boolean] {
    db.withConnection(autocommit = false) { implicit connection =>
      val result = SQL("DROP DATABASE IF EXISTS $database").execute()
      logger.info(f"dropDatabase result: $result")
      result
    }
  }(ec)

  def createTable(sql: String) = Future[Boolean] {
    db.withConnection(autocommit = false) { implicit connection =>
      val result = SQL(sql).execute()
      logger.info(f"createDatabase result: $result")
      result
    }
  }(ec)

  def dropTable(database: String, table: String) = Future[Boolean] {
    db.withConnection(autocommit = false) { implicit connection =>
      val result = SQL("DROP TABLE IF EXISTS $database.$table").execute()
      logger.info(f"dropTable result: $result")
      result
    }
  }(ec)
}
