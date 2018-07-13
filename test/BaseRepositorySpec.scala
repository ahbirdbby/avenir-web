import anorm._
import org.scalatest.concurrent.ScalaFutures
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerTest
import play.api.Logger
import play.api.db.DBApi
import play.api.test.Injecting

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

import javax.inject.Inject

class BaseRepositorySpec @Inject()(dbApi: DBApi) extends PlaySpec with GuiceOneAppPerTest with ScalaFutures with Injecting {
  import models._

  import scala.concurrent.ExecutionContext.Implicits.global

  val db = dbApi.database("default")
  "BaseRepositorySpec" should {

    "create database ==> create table ==>" in {
      val abc = "test"
      abc must equal("test")
      val base = app.injector.instanceOf(classOf[BaseRepository])
      val createMysql = "CREATE DATABASE IF NOT EXISTS xmysql WITH DBPROPERTIES (dbremote='true', url='jdbc:mysql://10.240.66.197:3306/quest_stage?useSSL=false', user='root', password='root', type='MySQL', dbname='quest_stage')"
      base.createDatabase(createMysql) onComplete {
        case Success(r) => r match {
          case true => {
            db.withConnection(autocommit = false) { implicit  connection =>
              val mysql = SQL("SHOW DATABASES LIKE 'xmysql'").executeQuery().as(SqlParser.str("databaseName").single)
              mysql mustBe Some("xmysql")
            }

            val createTable =
              """CREATE TABLE `xmysql`.item(
               ITEM_ID            bigint,
               ITEM_NAME          string,
               RETAIL_PRICE       decimal(10,2),
               ITEM_PICTURE       binary,
               ITEM_DESCRIPTION   string
               ) TBLPROPERTIES (dbremote='true', dataObject='ITEM')"""
            base.createTable(createTable) onComplete {
              case Success(rr) => rr match {
                case true => {
                  db.withConnection(autocommit = false) { implicit  connection =>
                    val r = SQL("SHOW TABLES IN xmysql").executeQuery().as(SqlParser.str("tableName").single)
                    r mustBe Some("item")
                  }

                  base.dropDatabase("xmysql") onComplete {
                    case Success(rrr) => Logger.info("Success drop xmysql")
                    case Failure(t) => Logger.error("Failed to drop xmysql", t)
                  }
                }
              }
              case Failure(t) => Logger.error("Failed to create table", t)
            }
          }
        }
        case Failure(t) => Logger.error("Failed to create database", t)
      }
    }
  }
}
