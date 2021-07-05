
 <?php
 
  $farmname = $_GET["name"];
  $farmurl = $_GET["url"];
  
  
  $servername = "host:port";
$username = "db_user";
$password = "db_password";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$conn->query('use db_name');
#echo "Connected successfully";



$sql = "
SELECT * from farms f  where name ='$farmname'
UNION all
SELECT * from farms  where html  like '%a href%%$farmurl%Go%'
UNION all
select * from farms where name like '%$farmname%' or html like '%$farmurl%' limit 1";

//$sql = 'SELECT DATABASE();';

$result = $conn->query($sql);


if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo json_encode($row);
  }
} else {
  #echo "0 results";
}

  ?> 
