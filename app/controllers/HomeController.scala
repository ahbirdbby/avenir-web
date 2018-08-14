package controllers

import javax.inject._

import models._
import play.api._
import play.api.db.DBApi
import play.api.libs.json.{JsArray, JsError, Json, Writes}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}


case class MapDatabaseParam(host: String, port: Int, databaseType: String, user: String, password: String, from: String, to: String)

case class MapTableParam(from: String, to: String, databaseName: String)

case class RunQueryParam(sql: String)
/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(cc: ControllerComponents,  cr: ComputerRepository, baseRep: BaseRepository)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)

  implicit val mapDatabaseParamReads = Json.reads[MapDatabaseParam]

  implicit val mapTableParamReads = Json.reads[MapTableParam]

  implicit val runQueryParamReads = Json.reads[RunQueryParam]

  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
/*  def index() = Action.async { implicit request: Request[AnyContent] =>
    logger.info("home controller index action.")
    cr.createRemoteMysql() map { db =>
      Ok(Json.obj("database" -> db))
    }
  }*/

  val JSON_KEY_COMMENTS = "comments"
  val JSON_KEY_AUTHOR = "author"
  val JSON_KEY_TEXT = "text"
  val JSON_KEY_ID = "id"

  var commentsJson: JsArray = Json.arr(
    Json.obj(JSON_KEY_AUTHOR -> "Pete Hunt", JSON_KEY_TEXT -> "This is one comment"),
    Json.obj(JSON_KEY_AUTHOR -> "Jordan Walke", JSON_KEY_TEXT -> "This is *another* comment")
  )
  def comments = Action {
    Ok(commentsJson)
  }

  def comment(author: String, text: String) = Action {
    val newComment = Json.obj(
      JSON_KEY_AUTHOR -> author,
      JSON_KEY_TEXT -> text)
    commentsJson = commentsJson :+ newComment
    Ok(newComment)
  }

  def showDefaultDatabase() = Action.async {
    cr.showDatabases() map { db =>
      Ok(Json.obj("database" -> db))
    }
  }

  def appSummary = Action {
    Ok(Json.obj("content" -> "Scala Play React Seed - Avenir"))
  }

  def runQuery = Action.async(parse.json) { req =>
    val param = req.body.validate[RunQueryParam]

    param.fold[Future[Result]](
      errors => {
        Future {BadRequest(Json.obj("message" -> JsError.toJson(errors)))}
      },
      p => {
        baseRep.runQuery(p.sql) map { result =>
          Ok(Json.toJson(result))
        }
      }
    )
  }

  def getDatabases = Action.async {
    implicit val tableWrites = Json.writes[Table]
    implicit val databaseWrites = new Writes[Database] {
      def writes(db: Database) = Json.obj(
        "name" -> db.name,
        "tables" -> db.tables
      )
    }

    val remote = baseRep.getDatabases(true)
    val local = baseRep.getDatabases()
    val result = for {remoteResult <- remote
      localResult <- local
    } yield (remoteResult, localResult)

    result map {tuple =>
      Ok(Json.obj("remoteDatabases" -> tuple._1, "localDatabases" -> tuple._2))
    }
  }

  def mapDatabase = Action.async(parse.json) { req =>
    val param = req.body.validate[MapDatabaseParam]

    param.fold[Future[Result]](
      errors => {
        Future {BadRequest(Json.obj("message" -> JsError.toJson(errors)))}
      },
      p => {
        baseRep.mapDatabase(p) map { result =>
          if (result) Ok(Json.obj("status" -> "Success")) else Ok(Json.obj(("status" -> "Failure")))
        }
      }
    )
  }

  def unmapDatabase(databaseName: String) = Action.async { req =>
    baseRep.unmapDatabase(databaseName) map { result =>
      if (result) Ok(Json.obj("status" -> "Success")) else Ok(Json.obj(("status" -> "Failure")))
    }
  }

  def mapTable = Action.async(parse.json) { req =>
    val param = req.body.validate[MapTableParam]

    param.fold[Future[Result]](
      errors => {
        Future {BadRequest(Json.obj("message" -> JsError.toJson(errors)))}
      },
      p => {
        baseRep.mapTable(p) map { result =>
          if (result) Ok(Json.obj("status" -> "Success")) else Ok(Json.obj(("status" -> "Failure")))
        }
      }
    )
  }

  def unmapTable(databaseName: String, tableName: String) = Action.async { req =>
    baseRep.unmapTable(databaseName, tableName) map { result =>
      if (result) Ok(Json.obj("status" -> "Success")) else Ok(Json.obj(("status" -> "Failure")))
    }
  }
}
