(ns backend.core
  (:require [compojure.core :refer [routes defroutes POST]]
            [compojure.route :as route]
            [ring.middleware.file :refer [file-request]]
            [ring.logger :as logger]
            [ring.adapter.jetty :as server]
            [backend.search :refer [search]]))

(defroutes search-routes
  (POST "/search" _ search))

(defroutes static-routes
  (route/files "/")
  (route/not-found "<h1>Not found</h1>"))

(defonce server (atom nil))

(def app
  (logger/wrap-with-logger
    (routes
      search-routes
      static-routes)))

(defn start-server []
  (when-not @server
    (reset! server (server/run-jetty #'app {:port 3000 :join? false}))))

(defn stop-server []
  (when @server
    (.stop @server)
    (reset! server nil)))

(defn restart-server []
  (when @server
    (stop-server)
    (start-server)))
