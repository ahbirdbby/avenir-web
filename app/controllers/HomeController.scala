package controllers

import javax.inject._

import models.ComputerRepository
import play.api._
import play.api.db.DBApi
import play.api.libs.json.JsArray
import play.api.mvc._
import play.api.libs.json.{JsArray, Json}

import scala.concurrent.{ExecutionContext, Future}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(cc: ControllerComponents, indexTemplate: views.html.home.index, cr: ComputerRepository)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  private val logger = Logger(this.getClass)


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

  def index() = Action { implicit request =>
    Ok(indexTemplate())
 }

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
}
