<?php

class MenuItem {
	
	protected $q,$label;
	
	function __construct($q, $label) {
		$this->q = $q;
		$this->link = "?q=$q";
		$this->label = $label;
	}
	
	public function getLink() {
		return $this->link;
	}
	
	public function getQ() {
		return $this->q;
	}
	
	public function getLabel() {
		return $this->label;
	}
	
	public function render() {
		echo '<a href="' . $this->getLink() . '"';
		
		if(isset($_GET['q'])) {
			if($_GET['q'] == $this->getQ()) {
				echo ' class="active"';
			}
		}
		
		echo '>' . $this->getLabel() . '</a>';
	}
}

?>