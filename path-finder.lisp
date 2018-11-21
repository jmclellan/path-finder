;;;; path-finder.lisp

(in-package #:path-finder)


;;; initiate the server
(defvar *server-obj* nil "location to store the server object")

(defun initiate-server ()
  (setf *server-obj*
        (hunchentoot:start (make-instance 'hunchentoot:easy-acceptor
                                    :port 8080
                                    :document-root #p"static-pages/"))))

(hunchentoot:define-easy-handler (say-yo :uri "/yo") (name)
  (setf (hunchentoot:content-type*) "text/plain")
  (format nil "Hey~@[ ~A~]!" name))

(hunchentoot:define-easy-handler (random-number :uri "/rand") ()
  (setf (hunchentoot:content-type*) "text/plain")
  (write-to-string (random 10)))


(hunchentoot:define-easy-handler (optimize-route :uri "/optimize-route"
                                                 :default-request-type :POST)
    (coordinates)
  (setf (hunchentoot:content-type*) "text/plain")
  ;; nasty setf to parse nested json arrays into lisp friendly format
  (setf coordinates (cl-json:decode-json-from-string coordinates))
  (print coordinates)
  (cl-json:encode-json-to-string coordinates))

