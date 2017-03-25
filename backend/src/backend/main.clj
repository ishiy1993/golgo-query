(ns backend.main
    (:require [backend.core :as core])
    (:gen-class))

(defn -main [& {:as args}]
  (core/start-server))
