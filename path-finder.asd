;;;; path-finder.asd

(asdf:defsystem #:path-finder
  :description "Describe path-finder here"
  :author "Your Name <your.name@example.com>"
  :license  "Specify license here"
  :version "0.0.1"
  :serial t
  :depends-on (#:alexandria #:hunchentoot)
  :components ((:file "package")
               (:file "path-finder")))
