
<?php 
if(isset($_POST['submit'])){
    $to = "bodlasahith@gmail.com";
    $from = htmlspecialchars($_POST["email"]);
    $name = htmlspecialchars($_POST["name"]);
    $subject = "Form submission";
    $subject2 = "Copy of your form submission";
    $message = $name . " wrote the following:" . "\n\n" . htmlspecialchars($_POST["message"]);
    $message2 = "Here is a copy of your message " . $name . "\n\n" . htmlspecialchars($_POST["message"]);

    $headers = "From:" . $from;
    $headers2 = "From:" . $to;
    mail($to,$subject,$message,$headers);
    mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender
    echo "Mail Sent. Thank you " . $name . ", we will contact you shortly.";
    // You can also use header('Location: thank_you.php'); to redirect to another page.
    // You cannot use header and echo together. It's one or the other.
    }
?>
