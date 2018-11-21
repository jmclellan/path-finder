;;;; path-finder.asd

(asdf:defsystem #:path-finder
  :description "a site built in lisp to help organize travel plans"
  :author "jvl.mclellan@gmail.com"
  :license  "Specify license here"
  :version "0.0.1"
  :serial t
  :depends-on (#:alexandria #:hunchentoot #:drakma #:cl-json)
  :components ((:file "package")
               (:file "path-finder")))
