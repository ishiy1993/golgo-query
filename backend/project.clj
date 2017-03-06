(defproject backend "0.1.0-SNAPSHOT"
  :description "golgo-query backend"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :plugins [[cider/cider-nrepl "0.14.0"]]
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/data.json "0.2.6"]
                 [clojurewerkz/elastisch "2.2.2"]
                 [ring "1.5.1"]
                 [ring/ring-json "0.4.0"]
                 [compojure "1.5.2"]])
