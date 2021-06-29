# Developing event-identification threhold

Inspired from ITHACA ERDS (Extreme Rainfall Detection System - [http://erds.ithacaweb.org](http://erds.ithacaweb.org)), The extreme rainfall detection is based on the concept of event-identification threshold: an alert is provided if the accumulated rainfall exceeds the threshold.

**THRESHOLD is AMOUNT OF RAINFALL NEEDED TO TRIGGER A EVENT (flood/flash-flood/landslide) INDUCED BY EXTREME RAINFALL**

## Frequency analysis

a return period, also known as a recurrence interval (sometimes repeat interval) is an estimate of the likelihood of an event, such as an earthquake, flood, landslide, or a river discharge flow to occur.

For example, a 10-year flood has a $$\frac{1}{10}$$ = $$0.1$$ or 10% chance of being exceeded in any one year and a 50-year flood has a 0.02 or 2% chance of being exceeded in any one year. This does not mean that a 100-year flood will happen regularly every 100 years, or only once in 100 years. Despite the connotations of the name "return period". In any given 100-year period, a 100-year event may occur once, twice, more, or not at all, and each outcome has a probability that can be computed as below.
Given that the return period of an event is 100 years,
P	= 1/100
= 0.01
So the probability that such an event occurs exactly once in 10 successive years is:
P(X = 1)	= (10/1) * 0.011* 0.999
= 10 * 0.01 * 0.914
= 0.0914
