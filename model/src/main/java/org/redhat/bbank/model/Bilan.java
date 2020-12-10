package org.redhat.bbank.model;

import java.util.ArrayList;
import java.util.List;

public class Bilan {
    private String siren;
	private double gg;
	private double ga;
	private double hp;
	private double hq;
	private double hn;
	private double fl;
	private double fm;
	private double dl;
    private double ee;
    private List<Variable> variables = new ArrayList<Variable>(); 
    
    public Bilan(){

    }
    public Bilan(String siren, double gg, double ga, double hp, double hq, double hn, double fl, double fm, double dl,
    double ee, List<Variable> variables) {
        this.siren = siren;
        this.gg = gg;
        this.ga = ga;
        this.hp = hp;
        this.hq = hq;
        this.hn = hn;
        this.fl = fl;
        this.fm = fm;
        this.dl = dl;
        this.ee = ee;
        this.variables = variables;
    }
    /**
     * @return double return the siren
     */
    public String getSiren() {
        return siren;
    }

    /**
     * @param siren the siren to set
     */
    public void setSiren(String siren) {
        this.siren = siren;
    }

    /**
     * @return double return the gg
     */
    public double getGg() {
        return gg;
    }

    /**
     * @param gg the gg to set
     */
    public void setGg(double gg) {
        this.gg = gg;
    }

    /**
     * @return double return the ga
     */
    public double getGa() {
        return ga;
    }

    /**
     * @param ga the ga to set
     */
    public void setGa(double ga) {
        this.ga = ga;
    }

    /**
     * @return double return the hp
     */
    public double getHp() {
        return hp;
    }

    /**
     * @param hp the hp to set
     */
    public void setHp(double hp) {
        this.hp = hp;
    }

    /**
     * @return double return the hq
     */
    public double getHq() {
        return hq;
    }

    /**
     * @param hq the hq to set
     */
    public void setHq(double hq) {
        this.hq = hq;
    }

    /**
     * @return double return the hn
     */
    public double getHn() {
        return hn;
    }

    /**
     * @param hn the hn to set
     */
    public void setHn(double hn) {
        this.hn = hn;
    }

    /**
     * @return double return the fl
     */
    public double getFl() {
        return fl;
    }

    /**
     * @param fl the fl to set
     */
    public void setFl(double fl) {
        this.fl = fl;
    }

    /**
     * @return double return the fm
     */
    public double getFm() {
        return fm;
    }

    /**
     * @param fm the fm to set
     */
    public void setFm(double fm) {
        this.fm = fm;
    }

    /**
     * @return double return the dl
     */
    public double getDl() {
        return dl;
    }

    /**
     * @param dl the dl to set
     */
    public void setDl(double dl) {
        this.dl = dl;
    }

    /**
     * @return double return the ee
     */
    public double getEe() {
        return ee;
    }

    /**
     * @param ee the ee to set
     */
    public void setEe(double ee) {
        this.ee = ee;
    }

	@Override
	public String toString() {
		return "Bilan [dl=" + dl + ", ee=" + ee + ", fl=" + fl + ", fm=" + fm + ", ga=" + ga + ", gg=" + gg + ", hn="
				+ hn + ", hp=" + hp + ", hq=" + hq + ", siren=" + siren + "]";
	}
	public List<Variable> getVariables() {
		return variables;
	}
	public void setVariables(List<Variable> variables) {
		this.variables = variables;
	}



}