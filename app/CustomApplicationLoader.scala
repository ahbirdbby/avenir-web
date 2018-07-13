import play.api.ApplicationLoader
import play.api.Configuration
import play.api.db.DBApi
import play.api.inject._
import play.api.inject.guice._

class CustomApplicationLoader extends GuiceApplicationLoader() {

  protected override def overrides(context: ApplicationLoader.Context): Seq[GuiceableModule] = {
    super.overrides(context) :+ (bind[DBApi].toProvider[CustomDBApiProvider]: GuiceableModule)
  }
}