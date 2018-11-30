<?php

class DateTimeEnhanced extends DateTime {
	public function returnAdd(DateInterval $interval)
	{
		$aux = clone $this;
		$aux->add($interval);
		return $aux;
	}

	public function returnSub(DateInterval $interval)
	{
		$aux = clone $this;
		$aux->sub($interval);
		return $aux;
	}
}

?>