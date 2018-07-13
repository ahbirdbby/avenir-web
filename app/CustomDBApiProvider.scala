import javax.inject.{Inject, Singleton}

import com.typesafe.config.Config
import play.api.{Configuration, Environment, Logger, Mode}
import play.api.db.{ConnectionPool, DBApi, DBApiProvider, DefaultDBApi}
import play.api.inject.{ApplicationLifecycle, Injector, NewInstanceInjector}

import scala.concurrent.Future

@Singleton
class CustomDBApiProvider(
                           environment: Environment,
                           configuration: Configuration,
                           defaultConnectionPool: ConnectionPool,
                           lifecycle: ApplicationLifecycle,
                           maybeInjector: Option[Injector]
                         ) extends DBApiProvider(environment, configuration, defaultConnectionPool, lifecycle, maybeInjector) {
  @Inject
  def this(
            environment: Environment,
            configuration: Configuration,
            defaultConnectionPool: ConnectionPool,
            lifecycle: ApplicationLifecycle,
            injector: Injector = NewInstanceInjector
          ) = {
    this(environment, configuration, defaultConnectionPool, lifecycle, Option(injector))
  }

  lazy override val get: DBApi = {
    Logger.info("CustomDBApiProvider ==> override")
    val config = configuration.underlying
    val dbKey = config.getString("play.db.config")
    val pool = maybeInjector
      .map(injector => ConnectionPool.fromConfig(config.getString("play.db.pool"), injector, environment, defaultConnectionPool))
      .getOrElse(ConnectionPool.fromConfig(config.getString("play.db.pool"), environment, defaultConnectionPool))
    val configs = if (config.hasPath(dbKey)) {
      Configuration(config).getPrototypedMap(dbKey, "play.db.prototype").mapValues(_.underlying)
    } else Map.empty[String, Config]
    val db = new CustomDBApi(configs, pool, environment, maybeInjector.getOrElse(NewInstanceInjector))
    lifecycle.addStopHook { () => Future.successful(db.shutdown()) }
    db.connect(logConnection = environment.mode != Mode.Test)
    db
  }
}
