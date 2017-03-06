(ns backend.search
    (:require [ring.middleware.json :refer [wrap-json-response]]
              [ring.util.response :as res]
              [clojurewerkz.elastisch.rest :as esr]
              [clojurewerkz.elastisch.rest.document :as esd]
              [clojurewerkz.elastisch.query :as q]
              [clojurewerkz.elastisch.rest.response :as esrsp]
              [clojure.pprint :as pp]
              [clojure.data.json :as json]))

(defn query [word]
  (let [conn (esr/connect "http://es:9200")
        body (if-let [vol (re-find #"(\d+)巻" word)]
               {:bool {:filter {:term {:volume (vol 1)}}}}
               {:multi_match {:query word :fields ["summary" "title"]}})
        res  (esd/search conn "golgo" "episode"
                         :query body
                         :sort {:episode {:order "asc"}})]
    (map :_source (:hits (:hits res)))))

(def response #'res/response)
(alter-meta! #'response #(merge % (meta #'res/response)))

(defn search-result [req]
   (let [q (json/read-str (slurp (:body req) :encoding "utf-8")
                          :key-fn keyword)]
     (response (query (:query q)))))

(defn search [q]
  (wrap-json-response search-result))

