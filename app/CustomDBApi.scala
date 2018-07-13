import com.typesafe.config.Config
import play.api.{Configuration, Environment, Logger}
import play.api.db.{ConnectionPool, DefaultDBApi, HikariCPConnectionPool}
import play.api.inject.{Injector, NewInstanceInjector}

import scala.util.control.NonFatal

class CustomDBApi(
                   configuration: Map[String, Config],
                   defaultConnectionPool: ConnectionPool = new HikariCPConnectionPool(Environment.simple()),
                   environment: Environment = Environment.simple(),
                   injector: Injector = NewInstanceInjector) extends DefaultDBApi(configuration, defaultConnectionPool, environment, injector){

  import CustomDBApi._

  /**
    * Try to connect to all data sources.
    */
  override def connect(logConnection: Boolean = false): Unit = {
    databases foreach { db =>
      try {
        db.getConnection(autocommit = false).close()
        if (logConnection) logger.info(s"Database [${db.name}] connected at ${db.url}")
      } catch {
        case NonFatal(e) =>
          throw Configuration(configuration(db.name)).reportError("url", s"Cannot connect to database [${db.name}]", Some(e))
      }
    }
  }
}

object CustomDBApi {
  private val logger = Logger(classOf[CustomDBApi])
}