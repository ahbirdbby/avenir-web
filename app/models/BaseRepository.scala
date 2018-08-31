package models

import java.io.InputStream
import java.math.BigInteger
import javax.inject.Inject

import org.slf4j.LoggerFactory
import play.api.db.DBApi
import anorm._
import anorm.{Cursor, Row}
import anorm.SqlParser.{bool, str}
import controllers.{MapDatabaseParam, MapTableParam}
import play.api.Logger
import play.api.libs.json._

import scala.collection.immutable
import scala.concurrent.Future

class Database(val name: String, var tables: Seq[Table], var properties: Map[String, String]) {
  def isRemote: Boolean = properties.getOrElse("dbremote", "false").toBoolean
}

case class Table(name: String)

class BaseColumn(val name: String, val dataType: String, val nullable: Boolean = false, val classes: String) {

}

object BaseColumn {
  def apply(name: String, dataType: String, nullable: Boolean = false, classes: String): BaseColumn = new BaseColumn(name, dataType, nullable, classes)

  def unapply(arg: BaseColumn): Option[(String, String, Boolean, String)] = Some((arg.name, arg.dataType, arg.nullable, arg.classes))
}

case class Column(override val name: String, override val dataType: String, sourceType: String, primaryKey: String, override val nullable: Boolean = false) extends BaseColumn(name, dataType, nullable, "")

case class ResultSet(columns: List[BaseColumn], rows: List[List[Any]])

object ResultSet {
  implicit val baseColumnWrites = new Writes[BaseColumn] {
    override def writes(o: BaseColumn): JsValue = Json.obj("name" -> o.name, "dataType" -> o.dataType)
  }

  implicit val resultSetWrites = new Writes[ResultSet] {
    def writes(r: ResultSet) = {
      val a = r.rows map { row =>
        row map { i =>
          i match {
            case Some(d) => {
              d match {
                case b: Boolean => JsBoolean(b)

                case i: Int => JsNumber(i)
                case l: Long => JsNumber(l)
                case f: Float => JsNumber(BigDecimal(f.toDouble))
                case s: Short => JsNumber(BigDecimal(s))
                case jbd: java.math.BigDecimal => JsNumber(jbd)
                case bi: BigInteger => JsNumber(BigDecimal(bi))
                case d: Double => JsNumber(d)

                case string: String => JsString(string)
                case clob: java.sql.Clob => JsString(clob.getSubString(1, clob.length.asInstanceOf[Int]))
                case bytes: Array[Byte] => JsString(new String(bytes))
                case stream: InputStream => JsString(scala.io.Source.fromInputStream(stream).mkString)
                case blob: java.sql.Blob => JsString(new String(blob.getBytes(1l, blob.length().asInstanceOf[Int])))

                case others => JsString(others.toString)
              }
            }
            case None => JsNull
          }
        }
      }

      Json.obj("columns" -> r.columns, "rows" -> a)
    }
  }
}

trait Connection {
  def host: String
  def port: Int
  def databaseType: String
  def databaseName: String
  def user: String
  def password: String
  def url: String
}
class BaseConnection(val host: String, val port: Int, val databaseType: String, val databaseName: String,
                     val user: String, val password: String
                     ) extends Connection {
  val url: String = "'jdbc:" + databaseType.toLowerCase() + "://" + host + ":" + port + "/" + databaseName + "'"
}

class MySQLConnection(override val host: String, override val port: Int, override val databaseName: String,
                           override val user: String, override val password: String
                          ) extends BaseConnection(host, port, "MySQL", databaseName, user, password) {
  override val databaseType:String = "MySQL"
}

class PostgreSQLConnection(override val host: String, override val port: Int, override val databaseName: String,
                                override val user: String, override val password: String
                          ) extends BaseConnection(host, port, "PostgreSQL", databaseName, user, password) {
  override val databaseType:String = "PostgreSQL"
}

class DB2Connection(override val host: String, override val port: Int, override val databaseName: String,
                                override val user: String, override val password: String
                               ) extends BaseConnection(host, port, "DB2", databaseName, user, password) {
  override val databaseType:String = "DB2"
}

class FileMakerConnection(override val host: String, override val port: Int, override val databaseName: String,
                         override val user: String, override val password: String
                        ) extends BaseConnection(host, port, "FileMaker", databaseName, user, password) {
  override val databaseType:String = "FileMaker"
}

class MariaDBConnection(override val host: String, override val port: Int, override val databaseName: String,
                               override val user: String, override val password: String
                              ) extends BaseConnection(host, port, "MariaDB", databaseName, user, password) {
  override val databaseType:String = "MariaDB"
}

class OracleConnection(override val host: String, override val port: Int, override val databaseName: String,
                                override val user: String, override val password: String
                               ) extends BaseConnection(host, port, "Oracle", databaseName, user, password) {
  override val databaseType:String = "Oracle"
  override val url: String = "'jdbc:" + databaseType.toLowerCase() + ":thin:@" + host + ":" + port + "/" + databaseName + "'"
}

class SQLServerConnection(override val host: String, override val port: Int, override val databaseName: String,
                                override val user: String, override val password: String
                               ) extends BaseConnection(host, port, "SQLServer", databaseName, user, password) {
  override val databaseType:String = "SQLServer"
  override val url: String = "'jdbc:" + databaseType.toLowerCase() + "://" + host + ":" + port + "^databaseName=" + databaseName + "^integratedSecurity=false^"
}

class SQLAzureConnection(override val host: String, override val port: Int, override val databaseName: String,
                               override val user: String, override val password: String
                              ) extends BaseConnection(host, port, "SQLAzure", databaseName, user, password) {
  override val databaseType:String = "SQLAzure"
  override val url: String = "'jdbc:sqlserver://" + host + ":" + port + "^databaseName=" + databaseName + "^integratedSecurity=false^"
}

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

  val parser: RowParser[Database] = str("databaseName") map {
    case n => new Database(n, Seq.empty[Table], Map.empty)
  }

  val dbDescParser = str("database_description_item") ~ str("database_description_value") map { case key ~ value => (key, value)}

  val tableParser = str("database") ~ str("tableName") map {
    case db ~ tbl => Table(tbl)
  }

  val columnParser = str("col_name") ~ str("data_type") ~ str("source_type") ~ str("primary_key") map {
    case name ~ dataType ~ sourceType ~ primaryKey => models.Column(name, dataType, sourceType, primaryKey)
  }

  val simpleColumnParser = str("col_name") ~ str("data_type") map {
    case name ~ dataType => models.Column(name, dataType, "", "")
  }

  val queryParser: RowParser[List[Any]] =
    SqlParser.folder(List[Any]()) { (l, d, meta) =>
      Right(d :: l)
    }

  def buildQueryParser(cols: Seq[BaseColumn]): RowParser[List[Any]] = RowParser[List[Any]] {row =>
    val r = immutable.List[Any]()
    cols.foreach(c => r.::(row(c.name)))
    new Success[List[Any]](List[Any](r: _*))
  }

  val simpleQueryParser: RowParser[List[Any]] = RowParser[List[Any]] { row =>
    Success(row.asList)
  }

    def getDatabases(fromRemote: Boolean = false) = Future[Seq[Database]] {
    db.withConnection(autocommit = false) { implicit connection =>
      var result = Seq.empty[Database]
      try {
        val showTables = "show " + (if (fromRemote) "remote" else "") + " tables"
        val dbs = SQL("show databases").as(parser.*)
        dbs.map(db => {
          val name = db.name
          var properties = ""
          SQL"describe database extended #$name".as(dbDescParser.*) map { item => if (item._1 == "Properties") properties = item._2}
          Logger.info("properties of " + name + " : " + properties)
          db.properties = stringToMap(properties)
          if (fromRemote && db.isRemote || !fromRemote) {
            try {
              val tables = SQL"#$showTables in #$name".as(tableParser.*)
              db.tables = tables
              result = result :+ db
            } catch {
              case e: Throwable =>
                Logger.error("Failed to show tables ", e)
            }
          }
        })
        result
      } catch {
        case e: Throwable =>
          Logger.error("Failed to show databases ", e)
      } finally {
        connection.commit()
      }
      result
    }
  }(ec)

  def runQuery(sql: String) = Future[ResultSet] {
    db.withConnection(autocommit = false) { implicit connection =>
      val r = SQL(sql).executeQuery()
      var cols: List[BaseColumn] = List[BaseColumn]()
      r.resultSet.foreach(f => {
        val m = f.getMetaData
        cols = List.range(1, m.getColumnCount + 1) map { i =>
          new BaseColumn(m.getColumnName(i), m.getColumnTypeName(i), m.isNullable(i) == 1, m.getColumnClassName(i))
        }
      })

      val data = r.as(simpleQueryParser.*)

      ResultSet(cols, data)
    }
  }

  private def stringToMap(properties: String): Map[String, String] = {
    val firstWrap = "\\((.*)\\)".r
    var result = Map.empty[String, String]
    firstWrap.findFirstMatchIn(properties) match {
      case Some(m) => {
        val secondWrap = "\\((.+?)\\),".r
        val p = m.group(1) + ","
        for (pattern <- secondWrap.findAllMatchIn(p)) {
          val array = pattern.group(1).split(",", 2)
          result = result + (array(0) -> (if (array.length > 1) array(1) else ""))
        }
        result
      }
      case None => result
    }
  }

  def mapDatabase(param: MapDatabaseParam) = Future[Boolean] {
    db.withConnection { implicit connection =>
      var result = false
      val dbName = if (param.to.trim() == "") param.from else param.to
      try {
        val con = getConnection(param)
        val sql = "CREATE DATABASE IF NOT EXISTS " + dbName + " WITH DBPROPERTIES (dbremote='true', url=" + con.url + ", user='" + param.user + "', password='" + param.password + "', type='" + con.databaseType + "', dbname='" + param.from + "')"
        Logger.info("map database sql: " + sql)
        result = SQL(sql).execute()
        SQL"show remote tables in `#$dbName`".execute()
      } catch {
        case e:
          Throwable => Logger.error("Failed to map database.", e)
          SQL"drop database if exists `#$dbName` cascade".execute()
          throw e
      }
      result
    }
  }(ec)

  def unmapDatabase(name: String) = Future[Boolean] {
    db.withConnection { implicit connection =>
      SQL"drop database if exists `#$name`".execute()
    }
  }(ec)

  def mapTable(param: MapTableParam) = Future[Boolean] {
    db.withConnection { implicit connection =>
      val db = param.databaseName
      val from = param.from
      val to = param.to
      val columns = SQL"describe remote table `#$db`.`#$from`".as(columnParser.*)
      var colString = ""
      columns.foreach(col => colString += (col.name + " " + col.dataType + ","))
      val sql = s"create table $db.$to (" + colString.substring(0, colString.length - 1) + s") tblproperties (dbremote='true', dataObject='$from')"
      SQL(sql).execute()
    }
  }(ec)

  def unmapTable(databaseName: String, tableName: String) = Future[Boolean] {
    db.withConnection { implicit connection =>
      SQL"drop table if exists `#$databaseName`.`#$tableName`".execute()
    }
  }(ec)

  def getColumns(databaseName: String, tableName: String, remote: Boolean) = Future[Seq[Column]] {
    db.withConnection { implicit connection =>
      val remoteStr = if (remote) "remote" else ""
      val columns = SQL"describe #$remoteStr table `#$databaseName`.`#$tableName`".as(simpleColumnParser.*)
      columns
    }
  }(ec)

  def getConnection(param: MapDatabaseParam): Connection = {
    param.databaseType match {
      case "MySQL" => new MySQLConnection(param.host, param.port, param.from, param.user, param.password)
      case "PostgreSQL" => new PostgreSQLConnection(param.host, param.port, param.from, param.user, param.password)
      case "Oracle" => new OracleConnection(param.host, param.port, param.from, param.user, param.password)
      case "SQLServer" => new SQLServerConnection(param.host, param.port, param.from, param.user, param.password)
      case "DB2" => new DB2Connection(param.host, param.port, param.from, param.user, param.password)
      case "SQLAzure" => new SQLAzureConnection(param.host, param.port, param.from, param.user, param.password)
      case "FileMaker" => new FileMakerConnection(param.host, param.port, param.from, param.user, param.password)
      case "MariaDB" => new MariaDBConnection(param.host, param.port, param.from, param.user, param.password)
      case _ => new BaseConnection(param.host, param.port, param.databaseType, param.from, param.user, param.password)
    }
  }
}


