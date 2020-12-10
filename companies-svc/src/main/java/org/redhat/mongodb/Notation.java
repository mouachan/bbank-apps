package org.redhat.mongodb;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import org.bson.Document;

import io.quarkus.mongodb.panache.MongoEntity;
import io.quarkus.mongodb.panache.PanacheMongoEntity;

@MongoEntity(collection = "notation")
public class Notation extends PanacheMongoEntity{
    private String id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateCalcul;
    private String score;
    private String note;
    private String orientation;
    private String typeAiguillage;
    private String decoupageSectoriel;
    private String detail;
    private String siren;

    public Notation(String id, Date dateCalcul, String score, String note, String orientation, String typeAiguillage,
			String decoupageSectoriel, String detail, String siren) {
		this.id = id;
		this.dateCalcul = dateCalcul;
		this.score = score;
		this.note = note;
		this.orientation = orientation;
		this.typeAiguillage = typeAiguillage;
		this.decoupageSectoriel = decoupageSectoriel;
		this.detail = detail;
		this.siren = siren;
	}

    public Notation(){

    }
    /**
     * @return dateCalcul return the dateCalcul
     */
    public Date getDateCalcul() {
        return dateCalcul;
    }

    /**
     * @param dateCalcul the dateCalcul to set
     */
    public void setDateCalcul(Date dateCalcul) {
        this.dateCalcul = dateCalcul;
    }

    /**
     * @return String return the score
     */
    public String getScore() {
        return score;
    }

    /**
     * @param score the score to set
     */
    public void setScore(String score) {
        this.score = score;
    }

    /**
     * @return String return the note
     */
    public String getNote() {
        return note;
    }

    /**
     * @param note the note to set
     */
    public void setNote(String note) {
        this.note = note;
    }

    /**
     * @return String return the orientation
     */
    public String getOrientation() {
        return orientation;
    }

    /**
     * @param orientation the orientation to set
     */
    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }

    /**
     * @return String return the typeAiguillage
     */
    public String getTypeAiguillage() {
        return typeAiguillage;
    }

    /**
     * @param typeAiguillage the typeAiguillage to set
     */
    public void setTypeAiguillage(String typeAiguillage) {
        this.typeAiguillage = typeAiguillage;
    }

    /**
     * @return String return the decoupageSectoriel
     */
    public String getDecoupageSectoriel() {
        return decoupageSectoriel;
    }

    /**
     * @param decoupageSectoriel the decoupageSectoriel to set
     */
    public void setDecoupageSectoriel(String decoupageSectoriel) {
        this.decoupageSectoriel = decoupageSectoriel;
    }

    /**
     * @return String return the detail
     */
    public String getDetail() {
        return detail;
    }

    /**
     * @param detail the detail to set
     */
    public void setDetail(String detail) {
        this.detail = detail;
    }

	@Override
	public String toString() {
		return "Notation [dateCalcul=" + dateCalcul + ", decoupageSectoriel=" + decoupageSectoriel + ", detail=" + detail + ", id="
				+ id + ", note=" + note + ", orientation=" + orientation + ", score=" + score + ", siren=" + siren
				+ ", typeAiguillage=" + typeAiguillage + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((dateCalcul == null) ? 0 : dateCalcul.hashCode());
		result = prime * result + ((decoupageSectoriel == null) ? 0 : decoupageSectoriel.hashCode());
		result = prime * result + ((detail == null) ? 0 : detail.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((note == null) ? 0 : note.hashCode());
		result = prime * result + ((orientation == null) ? 0 : orientation.hashCode());
		result = prime * result + ((score == null) ? 0 : score.hashCode());
		result = prime * result + ((siren == null) ? 0 : siren.hashCode());
		result = prime * result + ((typeAiguillage == null) ? 0 : typeAiguillage.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Notation other = (Notation) obj;
		if (dateCalcul == null) {
			if (other.dateCalcul != null)
				return false;
		} else if (!dateCalcul.equals(other.dateCalcul))
			return false;
		if (decoupageSectoriel == null) {
			if (other.decoupageSectoriel != null)
				return false;
		} else if (!decoupageSectoriel.equals(other.decoupageSectoriel))
			return false;
		if (detail == null) {
			if (other.detail != null)
				return false;
		} else if (!detail.equals(other.detail))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (note == null) {
			if (other.note != null)
				return false;
		} else if (!note.equals(other.note))
			return false;
		if (orientation == null) {
			if (other.orientation != null)
				return false;
		} else if (!orientation.equals(other.orientation))
			return false;
		if (score == null) {
			if (other.score != null)
				return false;
		} else if (!score.equals(other.score))
			return false;
		if (siren == null) {
			if (other.siren != null)
				return false;
		} else if (!siren.equals(other.siren))
			return false;
		if (typeAiguillage == null) {
			if (other.typeAiguillage != null)
				return false;
		} else if (!typeAiguillage.equals(other.typeAiguillage))
			return false;
		return true;
	}




    /**
     * @return String return the siren
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
     * @return String return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }
    
    
    public static List<Notation> findBySiren(String siren){
        Document document = new Document()
        .append("siren", siren); 
       return  find(document).list();
    }

    public static Notation findFirstBySiren(String siren){
        Document document = new Document()
        .append("siren", siren); 
       return  (Notation)find(document).firstResult();
    }


}